/**
 * AppWrapper Component
 * Provides app-like mobile experience with proper viewport handling
 * Prevents zoom, handles safe areas, and ensures smooth UX
 */

import React, { useEffect, useRef } from 'react';

interface AppWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent double-tap zoom
        const preventDoubleTap = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        // Prevent pinch zoom
        const preventPinchZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        // Handle iOS keyboard scroll issues
        const handleFocus = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        };

        // Add event listeners
        document.addEventListener('touchstart', preventDoubleTap, { passive: false });
        document.addEventListener('touchmove', preventPinchZoom, { passive: false });
        document.addEventListener('focus', handleFocus, true);

        // Prevent pull-to-refresh on mobile
        document.body.style.overscrollBehavior = 'none';

        return () => {
            document.removeEventListener('touchstart', preventDoubleTap);
            document.removeEventListener('touchmove', preventPinchZoom);
            document.removeEventListener('focus', handleFocus, true);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`app-container ${className}`}
            style={{
                height: '100dvh',
                minHeight: '100vh',
                overflow: 'hidden',
                position: 'relative',
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

/**
 * PageContainer Component
 * App-like page wrapper with proper scrolling and spacing
 */
interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    scrollable?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
    children, 
    className = '',
    scrollable = true 
}) => {
    return (
        <div
            className={`page-container ${scrollable ? 'app-scroll' : ''} ${className}`}
            style={{
                height: scrollable ? 'calc(100dvh - var(--header-height, 0px))' : 'auto',
                overflow: scrollable ? 'auto' : 'visible',
                overscrollBehavior: 'contain',
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

/**
 * SafeArea Component
 * Handles safe area insets for notched devices
 */
interface SafeAreaProps {
    children: React.ReactNode;
    className?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'all';
}

export const SafeArea: React.FC<SafeAreaProps> = ({ 
    children, 
    className = '',
    position = 'all'
}) => {
    const getPadding = () => {
        switch (position) {
            case 'top':
                return { paddingTop: 'env(safe-area-inset-top)' };
            case 'bottom':
                return { paddingBottom: 'env(safe-area-inset-bottom)' };
            case 'left':
                return { paddingLeft: 'env(safe-area-inset-left)' };
            case 'right':
                return { paddingRight: 'env(safe-area-inset-right)' };
            case 'all':
                return {
                    paddingTop: 'env(safe-area-inset-top)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    paddingLeft: 'env(safe-area-inset-left)',
                    paddingRight: 'env(safe-area-inset-right)',
                };
            default:
                return {};
        }
    };

    return (
        <div className={`safe-area ${className}`} style={getPadding()}>
            {children}
        </div>
    );
};
