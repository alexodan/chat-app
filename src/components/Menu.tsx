'use client'

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal'
import { useDisclosure } from '@chakra-ui/hooks'
import Button from '@/components/common/Button'
import { css } from '../../styled-system/css'
import { useSupabase } from '@/components/SupabaseProvider'
import Link from 'next/link'
import Image from 'next/image'

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { session } = useSupabase()
  console.log('re-render menu')

  return (
    <div className={css({ padding: 2, bgColor: 'teal.600' })}>
      <Button onClick={onOpen}>
        <Image src="/burger-menu.svg" width={20} height={20} alt="menu" />
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size="full" placement="left">
        <DrawerOverlay className={css({ bgColor: 'white' })} />
        <DrawerContent className={css({ p: 4 })}>
          <DrawerCloseButton className={css({ alignSelf: 'end' })} />
          <DrawerHeader className={css({ textTransform: 'capitalize', mb: 2 })}>
            Hello {session?.user.user_metadata.username}
          </DrawerHeader>
          <DrawerBody>
            <ul>
              <li>
                <Link onClick={onClose} href="/account">
                  Account
                </Link>
              </li>
              {session && (
                <li>
                  <Link onClick={onClose} href="/auth/signout">
                    Sign Out
                  </Link>
                </li>
              )}
            </ul>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
