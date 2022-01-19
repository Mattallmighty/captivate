import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'
import { useTypedSelector } from '../redux/store'
import { useDispatch } from 'react-redux'
import {
  setEditedFixture,
  addFixtureType,
  updateFixtureType,
  deleteFixtureType,
} from '../redux/dmxSlice'
import MyFixtureEditing from './MyFixtureEditing'
import Input from '../base/Input'
import Slider from '@mui/material/Slider'
import styled from 'styled-components'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FixtureChannels from './FixtureChannels'
import { Button } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

type Props = {
  id: string
}

export default function MyFixture({ id }: Props) {
  const ft = useTypedSelector((state) => state.dmx.fixtureTypesByID[id])
  const isInUse = useTypedSelector(
    (state) =>
      state.dmx.universe.find((fixture) => fixture.type === ft.id) !== undefined
  )
  const isEditing = useTypedSelector((state) => state.dmx.editedFixture === id)
  const dispatch = useDispatch()

  const styles: { [key: string]: React.CSSProperties } = {
    name: {
      fontSize: '1rem',
      paddingRight: '0.5rem',
    },
    manufacturer: {
      fontSize: '0.8rem',
      opacity: 0.4,
    },
    channelCount: {
      fontSize: '0.9rem',
      paddingRight: '0.2rem',
    },
    spacer: {
      flex: '1 0 0',
    },
  }

  // if (isEditing) {
  //   return <MyFixtureEditing id={id} />
  // }

  return (
    <Root
      style={
        isEditing
          ? {
              border: '2px solid white',
              backgroundColor: '#7771',
              padding: '1rem',
            }
          : undefined
      }
    >
      {!isEditing ? (
        <Header
          onClick={() => dispatch(setEditedFixture(isEditing ? null : id))}
        >
          {ft.name ? <span style={styles.name}>{ft.name}</span> : null}
          {ft.manufacturer ? (
            <span style={styles.manufacturer}>{ft.manufacturer}</span>
          ) : null}
          <div style={styles.spacer} />
          <span style={styles.channelCount}>{ft.channels.length}</span>
          <span style={styles.manufacturer}>ch</span>
          {/* <IconButton onClick={() => dispatch(setEditedFixture(id))}>
          <EditIcon />
        </IconButton> */}
        </Header>
      ) : (
        <Body>
          <Input
            value={ft.name}
            onChange={(newVal) =>
              dispatch(
                updateFixtureType({
                  ...ft,
                  name: newVal,
                })
              )
            }
          />
          <Sp2 />
          <Input
            value={ft.manufacturer || ''}
            onChange={(newVal) =>
              dispatch(
                updateFixtureType({
                  ...ft,
                  manufacturer: newVal,
                })
              )
            }
          />
          <Sp2 />
          <Slider
            id="epicness"
            value={ft.epicness}
            step={0.01}
            min={0}
            max={1}
            valueLabelDisplay="off"
            onChange={(e, newVal) =>
              dispatch(
                updateFixtureType({
                  ...ft,
                  epicness: Array.isArray(newVal) ? newVal[0] : newVal,
                })
              )
            }
          />
          <FixtureChannels fixtureID={id} isInUse={isInUse} />
          <Sp />
          <IconButton
            onClick={() => {
              dispatch(setEditedFixture(null))
            }}
            style={{ marginRight: '1rem' }}
          >
            <ExpandLessIcon />
          </IconButton>
          <Button
            size="small"
            disabled={isInUse}
            variant="contained"
            onClick={() => dispatch(deleteFixtureType(id))}
          >
            Delete Fixture
          </Button>
        </Body>
      )}
    </Root>
  )
}

const Root = styled.div`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  border: 1px solid #0000;
  :hover {
    /* background-color: #7775; */
    border: 1px solid ${(props) => props.theme.colors.divider};
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`

const Body = styled.div``

const Sp = styled.div`
  height: 1rem;
  flex: 1 0 0;
`

const Sp2 = styled.div`
  height: 0.5rem;
`
