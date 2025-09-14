import "../../index.css";
import * as React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Observer } from 'mobx-react-lite';
import Api from '../../services/Api';
import Auth from '../../context/Auth';
import INotes from '../../types/INotes';
import { Container, Row, Col, Button, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import { CircularProgress } from "@mui/material";
import { AiOutlinePlus } from 'react-icons/ai';
import ResponsiveFloatingBtn from "../../components/ResponsiveFloatingBtn";
import NoteCard from "../../components/CustomNoteCard";

export default function Notes() {
  const { strings } = useLanguage();

  const [isLoading, setIsLoading] = React.useState(true);
  const [notes, setNotes] = React.useState<INotes[]>([]);
  const [filteredNotes, setFilteredNotes] = React.useState<INotes[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'public' | 'private'>('all');
  const [sortOrder, setSortOrder] = React.useState<'title' | 'date'>('date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [contextMenu, setContextMenu] = React.useState<{ show: boolean, x: number, y: number, noteId: string | null }>({ show: false, x: 0, y: 0, noteId: null });
  const hasLoaded = React.useRef(false);

  // On page load: Get notes from the API (only once)
  React.useEffect(() => {
    if (!hasLoaded.current && Auth.token) {
      hasLoaded.current = true;
      Api.GetNotes(Auth.token, 1, 100)
        .then((result) => {
          setNotes(result);
          setIsLoading(false);
        })
        .catch((error) => {
          alert('Promise rejected with error: ' + error);
          setIsLoading(false);
        });
    }
  }, []);

  // Event listener: Closes the context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setContextMenu({ show: false, x: 0, y: 0, noteId: null });
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // On search, filter or sort field change
  React.useEffect(() => {
    if (!notes || !Array.isArray(notes)) {
      setFilteredNotes([]);
      return;
    }

    let filtered = notes;

    if (filter !== 'all') {
      filtered = notes.filter(note => note.isPublic === (filter === 'public'));
    }

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOrder === 'title') {
      filtered = filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB, 'en', { sensitivity: 'base' });
      });
    } else if (sortOrder === 'date') {
      if (filtered.length > 0)
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setFilteredNotes(filtered);
  }, [notes, filter, sortOrder, searchQuery]);

  // Toggle note visibility
  const PublicNote = (noteId: string, isPublic: boolean) => {
    // Toggle note visibility in state
    setNotes(prevNotes => {
      if (!prevNotes || !Array.isArray(prevNotes)) {
        return [];
      }
      return prevNotes.map(note =>
        note.id === noteId ? { ...note, isPublic: !isPublic } : note
      );
    });

    // Toggle note visibility in API
    if (noteId) {
      Api.PublishNote(noteId, Auth.token)
        .then((result) => {
          Api.GetNotes(Auth.token, 1, 100)
            .then((result) => {
              setNotes(result);
            })
            .catch((error) => {
              alert('Promise rejected with error: ' + error);
            });
        })
        .catch((error) => {
          alert('Promise rejected with error: ' + error);
        });
    }
  };

  // Delete note function
  const DeleteNote = (noteId: string, confirm: boolean) => {
    // Confirmation prompt
    if (confirm) {
      const userConfirmed = window.confirm('Tem certeza de que deseja excluir esta nota?');
      if (!userConfirmed) {
        return;
      }
    }

    // Delete note from API
    if (noteId) {
      Api.DeleteNote(noteId, Auth.token)
        .then((result) => {
          Api.GetNotes(Auth.token, 1, 100)
            .then((result) => {
              setNotes(result);
            })
            .catch((error) => {
              alert('Promise rejected with error: ' + error);
            });
        })
        .catch((error) => {
          alert('Promise rejected with error: ' + error);
        });
    }

    // Close context menu
    setContextMenu({ show: false, x: 0, y: 0, noteId: null });
  };

  // Context menu event (delete note) handler
  const handleContextMenu = (event: React.MouseEvent, noteId: string) => {
    event.preventDefault();
    setContextMenu({ show: true, x: event.clientX, y: event.clientY, noteId });
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <Observer>
        {() => (
          <>
            <AnimatePresence key='divNotes'>
              <motion.div initial={{ y: -1000 }} animate={{ y: 0 }} transition={{ duration: 0.2 }}>
                <Container className="my-4 note-list">
                  <InputGroup className="mb-3">
                    <FormControl className="txt-search" placeholder={strings.notes_searchNotes} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </InputGroup>

                  <div className="filter-sort-container mb-3">
                    <div className="filter-buttons">
                      <Button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>{strings.notes_allNotes}</Button>
                      <Button className={`filter-button ${filter === 'public' ? 'active' : ''}`} onClick={() => setFilter('public')}>{strings.notes_publicNotes}</Button>
                      <Button className={`filter-button ${filter === 'private' ? 'active' : ''}`} onClick={() => setFilter('private')}>{strings.notes_privateNotes}</Button>
                    </div>
                    <Dropdown onSelect={(eventKey) => setSortOrder(eventKey as 'title' | 'date')} className="sort-dropdown">
                      <Dropdown.Toggle variant="primary">
                        {strings.notes_sortBy} {sortOrder === "title" ? (strings.notes_titleNote) : (strings.notes_dateNote)}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="title">{strings.notes_titleNote}</Dropdown.Item>
                        <Dropdown.Item eventKey="date">{strings.notes_dateNote}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <Row>
                    {isLoading ? (
                      <Row>
                        <Col className="d-flex justify-content-center" style={{ marginTop: '1rem' }}>
                          <CircularProgress size={24} color="inherit" />
                        </Col>
                      </Row>
                    ) : !filteredNotes || filteredNotes.length === 0 ? (
                      <Row>
                        <Col className="d-flex justify-content-center" style={{ marginTop: '1rem' }}></Col>
                      </Row>
                    ) : (
                      filteredNotes.map(note => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          onContextMenu={(e, id) => handleContextMenu(e, id)}
                          onPublicToggle={(id, isPublic) => PublicNote(id, isPublic)}
                          onDelete={(id) => DeleteNote(id, true)}
                        />
                      ))
                    )}
                  </Row>

                  {contextMenu.show && (
                    <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                      <button onClick={() => { if (contextMenu.noteId) { DeleteNote(contextMenu.noteId, false) } }}>{strings.notes_deleteNote}</button>
                    </div>
                  )}
                </Container>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence key='divNotesFloatingButton'>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <ResponsiveFloatingBtn route="/CreateNote" icon={<AiOutlinePlus size={40} />} iconSize={40}
                  spanText={strings.notes_addNote} />
              </motion.div>
            </AnimatePresence>
          </>
        )
        }
      </Observer >
    </div>
  );
}
