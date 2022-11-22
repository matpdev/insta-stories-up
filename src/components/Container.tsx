import React, { useContext, useState, useRef, useEffect } from 'react'
import GlobalContext from './../context/Global'
import StoriesContext from './../context/Stories'
import ProgressContext from './../context/Progress'
import Story from './Story'
import ProgressArray from './ProgressArray'
import {
  GlobalCtx,
  StoriesContext as StoriesContextInterface,
} from './../interfaces'

export default function () {
  const [currentId, setCurrentId] = useState<number>(0)
  const [pause, setPause] = useState<boolean>(true)
  // const [muted, setMuted] = useState<boolean>(true);
  const [bufferAction, setBufferAction] = useState<boolean>(true)
  const [videoDuration, setVideoDuration] = useState<number>(0)

  let mousedownId = useRef<any>()
  let isMounted = useRef<boolean>(true)

  const {
    width,
    height,
    loop,
    currentIndex,
    isPaused,
    keyboardNavigation,
    preventDefault,
    storyContainerStyles = {},
    isMuted,
  } = useContext<GlobalCtx>(GlobalContext)
  const { stories } = useContext<StoriesContextInterface>(StoriesContext)

  console.log('Container', isMuted)

  useEffect(() => {
    if (typeof currentIndex === 'number') {
      if (currentIndex >= 0 && currentIndex < stories.length) {
        setCurrentIdWrapper(() => currentIndex)
      } else {
        console.error(
          'Index out of bounds. Current index was set to value more than the length of stories array.',
          currentIndex,
        )
      }
    }
  }, [currentIndex])

  useEffect(() => {
    if (typeof isPaused === 'boolean') {
      setPause(isPaused)
    }
  }, [isPaused])

  useEffect(() => {
    const isClient = typeof window !== 'undefined' && window.document
    if (
      isClient &&
      typeof keyboardNavigation === 'boolean' &&
      keyboardNavigation
    ) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [keyboardNavigation])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      previous()
    } else if (e.key === 'ArrowRight') {
      next()
    }
  }

  const toggleState = (action: string, bufferAction?: boolean) => {
    setPause(action === 'pause')
    setBufferAction(!!bufferAction)
  }

  const setCurrentIdWrapper = (callback) => {
    setCurrentId(callback)
    toggleState('pause', true)
  }

  const previous = () => {
    setCurrentIdWrapper((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const next = () => {
    if (isMounted.current) {
      if (loop) {
        updateNextStoryIdForLoop()
      } else {
        updateNextStoryId()
      }
    }
  }

  const updateNextStoryIdForLoop = () => {
    setCurrentIdWrapper((prev) => (prev + 1) % stories.length)
  }

  const updateNextStoryId = () => {
    setCurrentIdWrapper((prev) => {
      if (prev < stories.length - 1) return prev + 1
      return prev
    })
  }

  const debouncePause = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    mousedownId.current = setTimeout(() => {
      toggleState('pause')
    }, 200)
  }

  const mouseUp = (type: string) => (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    e.preventDefault()
    mousedownId.current && clearTimeout(mousedownId.current)
    if (pause) {
      toggleState('play')
    } else {
      type === 'next' ? next() : previous()
    }
  }

  const getVideoDuration = (duration: number) => {
    setVideoDuration(duration * 1000)
  }

  return (
    <div
      style={{
        ...storyContainerStyles,
        ...styles.container,
        ...{ width, height },
      }}
    >
      <ProgressContext.Provider
        value={{
          bufferAction: bufferAction,
          videoDuration: videoDuration,
          currentId,
          pause,
          next,
        }}
      >
        <ProgressArray />
      </ProgressContext.Provider>
      <Story
        action={toggleState}
        bufferAction={bufferAction}
        playState={pause}
        story={stories[currentId]}
        getVideoDuration={getVideoDuration}
        isMuted={isMuted}
      />
      {!preventDefault && (
        <>
          <div style={styles.overlay}>
            <div
              style={{ width: '50%', zIndex: 999 }}
              onTouchStart={debouncePause}
              onTouchEnd={mouseUp('previous')}
              onMouseDown={debouncePause}
              onMouseUp={mouseUp('previous')}
            />
            <div
              style={{ width: '50%', zIndex: 999 }}
              onTouchStart={debouncePause}
              onTouchEnd={mouseUp('next')}
              onMouseDown={debouncePause}
              onMouseUp={mouseUp('next')}
            />
          </div>
          {/* {stories[currentId].type == "video" && (
            <div style={styles.overlay2}>
              <div
                style={{
                  width: "95%",
                  height: "30px",
                  position: "relative",
                  zIndex: 9999,
                  color: "#fff",
                  top: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
                onClick={() => setMuted(!muted)}
              >
                {muted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    className="iconify iconify--material-symbols"
                    width="25"
                    height="25"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m19.8 22.6l-3.025-3.025q-.625.4-1.325.688q-.7.287-1.45.462v-2.05q.35-.125.688-.25q.337-.125.637-.3L12 14.8V20l-5-5H3V9h3.2L1.4 4.2l1.4-1.4l18.4 18.4Zm-.2-5.8l-1.45-1.45q.425-.775.638-1.625q.212-.85.212-1.75q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.137Q21 8.8 21 11.975q0 1.325-.362 2.55q-.363 1.225-1.038 2.275Zm-3.35-3.35L14 11.2V7.95q1.175.55 1.838 1.65q.662 1.1.662 2.4q0 .375-.062.738q-.063.362-.188.712ZM12 9.2L9.4 6.6L12 4Z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    className="iconify iconify--material-symbols"
                    width="25"
                    height="25"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M15.35 20.3q-.5.2-.925-.125q-.425-.325-.425-.9q0-.275.163-.487q.162-.213.412-.313q2-.8 3.213-2.55Q19 14.175 19 11.975t-1.212-3.95q-1.213-1.75-3.213-2.55q-.275-.1-.425-.325q-.15-.225-.15-.5q0-.55.425-.875q.425-.325.925-.125q2.55 1.025 4.1 3.275Q21 9.175 21 11.975t-1.55 5.05q-1.55 2.25-4.1 3.275ZM4 15q-.425 0-.712-.288Q3 14.425 3 14v-4q0-.425.288-.713Q3.575 9 4 9h3l3.3-3.3q.475-.475 1.087-.213q.613.263.613.938v11.15q0 .675-.613.937q-.612.263-1.087-.212L7 15Zm10 1V7.95q1.125.525 1.812 1.625q.688 1.1.688 2.425q0 1.325-.688 2.4Q15.125 15.475 14 16Z"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          )} */}
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: '#111',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    height: 'inherit',
    width: 'inherit',
    display: 'flex',
  },
  overlay2: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
}
