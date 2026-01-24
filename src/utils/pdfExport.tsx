import { Document, Page, Text, View, Image, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { Note } from '@/types/note';
import React from 'react';

// Register the Kalam font for PDF
Font.register({
  family: 'Kalam',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/kalam/v16/YA9dr0Wd4kDdMtD6GgLO.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/kalam/v16/YA9Qr0Wd4kDdMtDqHTLMkiQ.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#faf8f5',
    fontFamily: 'Kalam',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d2520',
  },
  content: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#2d2520',
    marginBottom: 20,
  },
  drawingContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  drawingLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
});

interface NotePDFProps {
  note: Note;
  drawingImages: Map<string, string>;
}

const NotePDF: React.FC<NotePDFProps> = ({ note, drawingImages }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{note.title}</Text>
      {note.content && <Text style={styles.content}>{note.content}</Text>}
      {note.drawings.map((drawing, index) => {
        const imageData = drawingImages.get(drawing.id);
        if (!imageData) return null;
        
        return (
          <View key={drawing.id} style={styles.drawingContainer}>
            <Text style={styles.drawingLabel}>Drawing {index + 1}</Text>
            <Image
              src={imageData}
              style={{ width: drawing.width / 2, height: drawing.height / 2 }}
            />
          </View>
        );
      })}
      <Text style={styles.footer}>
        Created with StudyNotes • {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

export async function exportNoteToPdf(
  note: Note,
  drawingImages: Map<string, string>
): Promise<void> {
  const doc = <NotePDF note={note} drawingImages={drawingImages} />;
  const blob = await pdf(doc).toBlob();
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${note.title || 'note'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
