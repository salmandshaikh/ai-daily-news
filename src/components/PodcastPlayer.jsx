import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download, Volume2, SkipForward, SkipBack } from 'lucide-react'

function PodcastPlayer({ podcast }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playbackRate, setPlaybackRate] = useState(1)
    const audioRef = useRef(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration
        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
    }

    const skip = (seconds) => {
        audioRef.current.currentTime += seconds
    }

    const changePlaybackRate = () => {
        const rates = [1, 1.25, 1.5, 2]
        const currentIndex = rates.indexOf(playbackRate)
        const nextRate = rates[(currentIndex + 1) % rates.length]
        setPlaybackRate(nextRate)
        audioRef.current.playbackRate = nextRate
    }

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '48px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <Volume2 size={24} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                    }}>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            letterSpacing: '0.5px'
                        }}>
                            Daily Briefing
                        </span>
                        <span style={{
                            fontSize: '11px',
                            color: 'var(--text-secondary)'
                        }}>• {podcast.date}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        AI Daily News Podcast
                    </h3>
                </div>
                <a
                    href={podcast.file}
                    download={`ai-news-${podcast.date}.mp3`}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        background: 'transparent'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                        e.currentTarget.style.borderColor = 'var(--text-secondary)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                >
                    <Download size={16} />
                    <span className="hide-mobile">MP3</span>
                </a>
            </div>

            <audio ref={audioRef} src={podcast.file} preload="metadata" />

            {/* Progress Bar */}
            <div style={{ marginBottom: '20px', padding: '0 4px' }}>
                <div style={{
                    position: 'relative',
                    height: '6px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        background: 'var(--accent)',
                        borderRadius: '3px',
                        transition: 'width 0.1s linear'
                    }} />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginTop: '8px'
                }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px'
            }}>
                <button
                    onClick={() => skip(-10)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <SkipBack size={24} />
                    -10s
                </button>

                <button
                    onClick={togglePlay}
                    style={{
                        background: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--bg-primary)',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} style={{ marginLeft: '4px' }} fill="currentColor" />}
                </button>

                <button
                    onClick={() => skip(10)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <SkipForward size={24} />
                    +10s
                </button>
            </div>
        </div>
    )
}

export default PodcastPlayer
