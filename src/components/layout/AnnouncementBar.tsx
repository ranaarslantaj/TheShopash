import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[var(--foreground)] text-white">
      <div className="container mx-auto px-6 py-2.5 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/85">
          Complimentary insured shipping worldwide ·{' '}
          <span className="text-primary">Authenticated by master watchmakers</span>
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
