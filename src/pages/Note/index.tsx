import "../../index.css";
import { useLanguage } from '../../context/LanguageContext';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Api from '../../services/Api';
import INote from '../../types/INote';
import { CircularProgress } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { AnimatePresence, motion } from "framer-motion";
import { GoHome } from "react-icons/go";
import ResponsiveFloatingBtn from "../../components/ResponsiveFloatingBtn";

export default function Note() {
  const { strings } = useLanguage();

  const { id } = useParams<Record<string, string | undefined>>();
  const [note, setNote] = useState<INote>({ id: '', title: '', content: '', isPublic: false, createdAt: '', updatedAt: '' });
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // Page load
  useEffect(() => {
    let isMounted = true;

    if (id) {
      Api.GetPublicNote(id)
        .then((result) => {
          if (isMounted) {
            setNote(result);
            setTitle(result.title);
            setContent(result.content);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Container className="my-4" style={{ paddingTop: '50px' }}>
        <div className="d-flex justify-content-center" style={{ marginTop: '1rem' }}>
          <CircularProgress size={24} color="inherit" />
        </div>
      </Container>
    );
  }

  if (!loading && (!note || !content)) {
    return <div className="publicNoteNotFound" dangerouslySetInnerHTML={{ __html: strings.note_noteNotFound }} />;
  }

  return (
    <>
      <AnimatePresence key='divNotes'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="publicNoteContainer">
            <div className="publicNoteTitle" dangerouslySetInnerHTML={{ __html: title }} />
            <div className="publicNoteContent" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence key='divNotesFloatingButton'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <ResponsiveFloatingBtn route="/Notes" icon={<GoHome size={40} />} iconSize={40}
            spanText={strings.note_back} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
