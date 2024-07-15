"use client"

import { useEffect, useState } from 'react';

export function useHotkey(key, callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback]);
}