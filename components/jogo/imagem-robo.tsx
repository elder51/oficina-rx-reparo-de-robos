'use client'

import Image from 'next/image'
import { Bot } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImagemRoboProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

function ImagemRoboComRecuperacao({
  src,
  alt,
  width,
  height,
  className,
}: ImagemRoboProps) {
  const [tentativas, setTentativas] = useState(0)
  const [usarImagemPadrao, setUsarImagemPadrao] = useState(false)
  const [indisponivel, setIndisponivel] = useState(false)

  if (indisponivel) {
    return (
      <div
        className={cn('flex items-center justify-center bg-secondary text-muted-foreground', className)}
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt}, imagem indisponível` : undefined}
        aria-hidden={!alt}
      >
        <Bot aria-hidden="true" className="size-1/2" />
      </div>
    )
  }

  return (
    <Image
      src={
        usarImagemPadrao
          ? '/robos/atlas.png?fallback=1'
          : tentativas > 0
            ? `${src}?retry=${tentativas}`
            : src
      }
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (usarImagemPadrao) setIndisponivel(true)
        else if (tentativas < 2) setTentativas(tentativas + 1)
        else setUsarImagemPadrao(true)
      }}
    />
  )
}

export function ImagemRobo(props: ImagemRoboProps) {
  return <ImagemRoboComRecuperacao key={props.src} {...props} />
}
