import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Download, Mic } from 'lucide-react'

const SPEEDS = [1, 1.25, 1.5, 2]

const WAVE = [35,55,80,60,90,70,45,85,65,75,50,95,60,80,70,50,88,65,72,55,82,40,68,58,78,52,88,62,72,42]

function fmt(s) {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
}

function PodcastPlayer({ podcast }) {
    const audioRef = useRef(null)
    const [playing, setPlaying]   = useState(false)
    const [current, setCurrent]   = useState(0)
    const [duration, setDuration] = useState(podcast?.duration || 0)
    const [speedIdx, setSpeedIdx] = useState(0)

    const src = podcast?.file ? `${podcast.file}?v=${podcast.date || ''}` : null

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        const onTime = ()  => setCurrent(audio.currentTime)
        const onMeta = ()  => setDuration(audio.duration)
        const onEnd  = ()  => setPlaying(false)
        audio.addEventListener('timeupdate',     onTime)
        audio.addEventListener('loadedmetadata', onMeta)
        audio.addEventListener('ended',          onEnd)
        return () => {
            audio.removeEventListener('timeupdate',     onTime)
            audio.removeEventListener('loadedmetadata', onMeta)
            audio.removeEventListener('ended',          onEnd)
        }
    }, [])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing) { audio.pause(); setPlaying(false) }
        else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
    }

    const seek = e => {
        const audio = audioRef.current
        if (!audio || !duration) return
        const bar = e.currentTarget.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(1, (e.clientX - bar.left) / bar.width))
        audio.currentTime = ratio * duration
    }

    const skip = secs => {
        const audio = audioRef.current
        if (audio) audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + secs))
    }

    const cycleSpeed = () => {
        const audio = audioRef.current
        const next = (speedIdx + 1) % SPEEDS.length
        setSpeedIdx(next)
        if (audio) audio.playbackRate = SPEEDS[next]
    }

    const pct = duration > 0 ? (current / duration) * 100 : 0

    return (
        <>
            {src && <audio ref={audioRef} src={src} preload="metadata" />}

            <div className="podcast-bar">
                {/* Album art */}
                <div className="pod-art">
                    <Mic size={26} strokeWidth={1.5} />
                </div>

                {/* Info */}
                <div className="pod-info">
                    <div className="pod-show">AI Daily Podcast</div>
                    <div className="pod-title">Today's AI Briefing</div>
                    <div className="pod-sub">
                        Alex &amp; Jordan &nbsp;·&nbsp; {podcast?.date || 'Today'}
                    </div>
                </div>

                {/* Controls */}
                <div className="pod-controls">
                    <button className="pod-btn" onClick={() => skip(-10)} title="Back 10s">
                        <SkipBack size={17} />
                    </button>
                    <button className="pod-play-btn" onClick={togglePlay}>
                        {playing
                            ? <Pause size={18} fill="currentColor" />
                            : <Play  size={18} fill="currentColor" style={{ marginLeft: 2 }} />
                        }
                    </button>
                    <button className="pod-btn" onClick={() => skip(30)} title="Forward 30s">
                        <SkipForward size={17} />
                    </button>
                </div>

                {/* Progress / waveform */}
                <div className="pod-progress">
                    <div className="pod-waveform" onClick={seek}>
                        {WAVE.map((h, i) => (
                            <div
                                key={i}
                                className="pod-wave-bar"
                                style={{
                                    height: `${h}%`,
                                    background: (i / WAVE.length) * 100 < pct
                                        ? 'var(--red)'
                                        : '#2e2e2e',
                                }}
                            />
                        ))}
                    </div>
                    <div className="pod-times">
                        <span>{fmt(current)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                </div>

                {/* Speed + download */}
                <div className="pod-extra">
                    <button className="pod-speed" onClick={cycleSpeed}>
                        {SPEEDS[speedIdx]}×
                    </button>
                    {src && (
                        <a href={src} download className="pod-dl-btn" title="Download episode">
                            <Download size={14} />
                        </a>
                    )}
                </div>
            </div>
        </>
    )
}

export default PodcastPlayer
