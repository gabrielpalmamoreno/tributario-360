import React, { useState } from 'react';

export default function TaxCard({ title, value, subtitle, tag, tagColor, icon, loading }) {
  const [hovered, setHovered] = useState(false);

  const tagColors = {
    green: { bg: 'rgba(0,200,150,0.12)', color: '#00C896' },
    yellow: { bg: 'rgba(245,166,35,0.12)', color: '#F5A623' },
    red: { bg: 'rgba(255,77,106,0.12)', color: '#FF4D6A' },
    blue: { bg: 'rgba(74,144,226,0.12)', color: '#4A90E2' },
  };

  const tagStyle = tagColors[tagColor] || tagColors.green;

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHovered : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardHeader}>
        <span style={styles.cardIcon}>{icon}</span>
        {tag && (
          <span style={{ ...styles.tag, backgroundColor: tagStyle.bg, color: tagStyle.color }}>
            {tag}
          </span>
        )}
      </div>

      <div style={styles.cardBody}>
        {loading ? (
          <div style={styles.skeleton} />
        ) : (
          <p style={styles.cardValue}>{value}</p>
        )}
        <p style={styles.cardTitle}>{title}</p>
        {subtitle && <p style={styles.cardSubtitle}>{subtitle}</p>}
      </div>

      <div style={{
        ...styles.cardAccentLine,
        ...(hovered ? styles.cardAccentLineHovered : {}),
      }} />
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#151D27',
    border: '1px solid #1E2D3D',
    borderRadius: '14px',
    padding: '1.4rem',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  },
  cardHovered: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,200,150,0.2)',
    borderColor: 'rgba(0,200,150,0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.1rem',
  },
  cardIcon: {
    fontSize: '1.4rem',
    lineHeight: 1,
  },
  tag: {
    fontSize: '0.68rem',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '20px',
    letterSpacing: '0.03em',
    fontFamily: "'DM Sans', sans-serif",
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  cardValue: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: '700',
    fontSize: '1.7rem',
    color: '#E8EDF2',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  cardTitle: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#7A8FA6',
    marginTop: '0.2rem',
    fontFamily: "'DM Sans', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  cardSubtitle: {
    fontSize: '0.78rem',
    color: '#4A5A6A',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: '0.3rem',
  },
  cardAccentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '2px',
    width: '0%',
    backgroundColor: '#00C896',
    transition: 'width 0.3s ease',
    borderRadius: '0 0 14px 14px',
  },
  cardAccentLineHovered: {
    width: '100%',
  },
  skeleton: {
    height: '2rem',
    width: '60%',
    backgroundColor: '#1E2D3D',
    borderRadius: '6px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};
