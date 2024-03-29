import React, { useContext } from 'react'
import { StoryProps, GlobalCtx } from './../interfaces'
import GlobalContext from './../context/Global'

const Story = (props: StoryProps) => {
  const globalContext = useContext<GlobalCtx>(GlobalContext)

  const { width, height, loader, header, storyStyles, isMuted } = globalContext
  console.log('Story', isMuted)

  const rendererMessageHandler = (type: string, data: any) => {
    switch (type) {
      case 'UPDATE_VIDEO_DURATION':
        props.getVideoDuration(data.duration)
        return { ack: 'OK' as 'OK' }
    }
  }

  const getStoryContent = () => {
    let InnerContent = props.story.content
    let config = {
      width,
      height,
      loader,
      header,
      storyStyles,
      isMuted: props.isMuted,
    }
    return (
      <InnerContent
        action={props.action}
        isPaused={props.playState}
        story={props.story}
        isMuted={props.isMuted}
        config={config}
        messageHandler={rendererMessageHandler}
      />
    )
  }

  return (
    <div style={{ ...styles.story, width: width, height: height }}>
      {getStoryContent()}
    </div>
  )
}

const styles = {
  story: {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  storyContent: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
  },
}

export default Story
