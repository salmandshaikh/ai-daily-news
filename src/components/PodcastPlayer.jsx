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
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid var(--border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <Volume2 size={24} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                        🎙️ AI Daily News Podcast
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {podcast.date} • {podcast.speakers.join(' & ')} • ~{Math.floor(podcast.duration / 60)}:{(podcast.duration % 60).toString().padStart(2, '0')}
                    </p>
                </div>
                <a
                    href={podcast.file}
                    download={`ai-news-${podcast.date}.mp3`}
                    style={{
                        padding: '8px 16px',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}
                >
                    <Download size={16} />
                    Download
                </a>
            </div>

            <audio ref={audioRef} src={podcast.file} preload="metadata" />

            {/* Progress Bar */}
            <div style={{ marginBottom: '16px' }}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        outline: 'none',
                        cursor: 'pointer',
                        accentColor: 'var(--primary)'
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginTop: '4px'
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
                gap: '16px'
            }}>
                <button
                    onClick={() => skip(-10)}
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    title="Skip back 10s"
                >
                    <SkipBack size={20} />
                </button>

                <button
                    onClick={togglePlay}
                    style={{
                        background: 'var(--primary)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                    }}
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '2px' }} />}
                </button>

                <button
                    onClick={() => skip(10)}
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    title="Skip forward 10s"
                >
                    <SkipForward size={20} />
                </button>

                <button
                    onClick={changePlaybackRate}
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        minWidth: '50px',
                        transition: 'all 0.2s'
                    }}
                    title="Change playback speed"
                >
                    {playbackRate}x
                </button>
            </div>
        </div>
    )
}

export default PodcastPlayer
