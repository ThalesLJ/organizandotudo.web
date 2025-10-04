import "../../index.css";
import { useLanguage } from '../../context/LanguageContext';
import React, { useCallback, useState } from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import Auth from "../../context/Auth";
import ReactQuill from "react-quill";
import LoadingButton from '../../components/LoadingButton';
import FormInput from "../../components/FormInput";
import { AnimatePresence, motion } from "framer-motion";
import ICreateNote from "../../types/ICreateNote";

export default function CreateNote() {
  const { strings } = useLanguage();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Send the new note to API
  const Save = useCallback(() => {
    setIsSaving(true);

    const noteData: ICreateNote = { title, content, isPublic: false };
    Api.CreateNote(noteData, Auth.token)
      .then((result) => {
        navigate("/Notes");
        setIsSaving(false);
      })
      .catch((error) => {
        setIsSaving(false);
        alert('Promise rejected with error: ' + error);
      });
  }, [title, content, navigate]);

  // On page load: Add a key listener to save the note with Ctrl+Enter
  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'Enter') {
        Save();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [Save]);

  // Call the API to save the note when the form is submitted
  const FormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    Save();
    event.preventDefault();
  }

  // Sync the note content with the state
  const OnContentChange = (value: string) => {
    setContent(value);
  };

  return (
    <AnimatePresence key='divNotes'>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Container className="my-4" style={{ paddingTop: '50px' }}>
          <Card className="bg-transparent border-0">
            <Card.Body>
              <Form onSubmit={FormSubmit}>
                <FormInput type="text" value={title} labelFontSize={19} required
                  label={strings.createNote_noteTitle} placeholder={strings.createNote_noteTitlePlaceholder}
                  onChange={(e) => setTitle(e.target.value)} />

                <Form.Group controlId="formNoteContent" className="mt-3">
                  <Form.Label className="custom-label">{strings.createNote_noteContent}</Form.Label>
                  <ReactQuill className="resizable-editor" value={content} onChange={OnContentChange} placeholder={strings.createNote_noteContentPlaceholder} />
                </Form.Group>

                <LoadingButton 
                  type="submit" 
                  width="100%"
                  isLoading={isSaving}
                  style={{ marginTop: '10px' }}
                >
                  {strings.createNote_btnSave}
                </LoadingButton>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
}
