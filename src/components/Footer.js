
const Footer = () => {
    return (
        <footer style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '4px 0',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            fontSize: '10px',
            color: '#888',
            zIndex: 9999,
            backdropFilter: 'blur(2px)',
            borderTop: '1px solid #eee'
        }}>
            <p>Website dirancang oleh Mahasiswa PKL Teknik Informatika Unwidha pada 2026</p>
        </footer>
    );
};

export default Footer;
