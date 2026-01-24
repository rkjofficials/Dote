import { Document, Page, Text, View, Image, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { Note } from '@/types/note';
import React from 'react';

// Register the Kalam font for PDF with error handling
try {
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
} catch (error) {
  console.warn('Failed to load Kalam font, using default font:', error);
  // Font will fall back to default
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#faf8f5',
    fontFamily: 'Helvetica',
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
    flexWrap: 'wrap',
  },
  drawingContainer: {
    marginTop: 20,
    marginBottom: 20,
    pageBreakInside: 'avoid' as const,
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
    textAlign: 'center' as const,
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
      {note.content && (
        <Text style={styles.content}>{note.content}</Text>
      )}
      {note.drawings.map((drawing, index) => {
        const imageData = drawingImages.get(drawing.id);
        if (!imageData) return null;
        
        return (
          <View key={drawing.id} style={styles.drawingContainer}>
            <Text style={styles.drawingLabel}>Drawing {index + 1}</Text>
            <Image
              src={imageData}
              style={{
                width: Math.min(drawing.width / 2, 400),
                height: Math.min(drawing.height / 2, 300),
              }}
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
  try {
    // Validate that we have valid data
    if (!note.title && !note.content && note.drawings.length === 0) {
      throw new Error('Nothing to export. Create some content first.');
    }

    const doc = <NotePDF note={note} drawingImages={drawingImages} />;
    
    // Generate PDF blob with error handling
    const blob = await pdf(doc).toBlob().catch((error) => {
      console.error('PDF generation error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    });

    if (!blob || blob.size === 0) {
      throw new Error('PDF generation produced empty file');
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title || 'note'}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('PDF export failed:', errorMessage);
    throw new Error(`PDF export failed: ${errorMessage}`);
  }
}
