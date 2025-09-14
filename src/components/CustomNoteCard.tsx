import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RxExternalLink } from 'react-icons/rx';
import { IoLockOpen, IoLockClosed } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
  };
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onPublicToggle: (id: string, isPublic: boolean) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onContextMenu, onPublicToggle, onDelete }) => {
  return (
    <Col xs={12} sm={12} md={6} lg={6} xl={4} style={{ marginTop: '1rem' }}>
      <Card onContextMenu={(e) => onContextMenu(e, note.id)}>
        <Card.Body className="note-card-body">
          <Link to={`/EditNote/${note.id}`} style={{ textDecoration: 'none' }}>
            <Card.Title className="note-title">{note.title}</Card.Title>
          </Link>
          <div className="note-text-container">
            <Card.Text className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        </Card.Body>
        <Card.Footer className="text-muted note-card-footer">
          <div className="note-footer">
            <div className="note-leftFooter">
              {note.isPublic && (
                <span id="link-icon">
                  <Link to={`/Note/${note.id}`} style={{ textDecoration: 'none' }}>
                    <RxExternalLink />
                  </Link>
                </span>
              )}
            </div>
            <div className="note-rightFooter">
              <span id="lock-icon" onClick={() => onPublicToggle(note.id, note.isPublic)}>
                {note.isPublic ? <IoLockOpen /> : <IoLockClosed />}
              </span>
              <span id="trash-icon" onClick={() => onDelete(note.id)}>
                <FaTrash />
              </span>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default NoteCard;
