'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/lib/types'
import { Send, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

interface ChatProps {
  roomType: 'auction' | 'trade'
  roomId: string
  currentUserId: string
  otherUserName?: string
}

export default function Chat({ roomType, roomId, currentUserId, otherUserName }: ChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(username, full_name, avatar_url)')
        .eq('room_type', roomType)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data as Message[])
      }
    }

    loadMessages()
  }, [roomType, roomId])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomType}:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId},room_type=eq.${roomType}`,
        },
        async (payload) => {
          // Fetch the sender profile for the new message
          const { data: senderData } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single()

          const newMessage: Message = {
            ...(payload.new as Message),
            sender: senderData as any,
          }

          setMessages((prev) => {
            // Avoid duplicates (in case we already inserted locally)
            if (prev.some((m) => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomType, roomId])

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || sending) return

    setSending(true)
    setInput('')

    await supabase.from('messages').insert({
      room_type: roomType,
      room_id: roomId,
      sender_id: currentUserId,
      content,
    })

    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const headerLabel =
    roomType === 'auction'
      ? 'Chat de Subasta'
      : otherUserName
      ? `Chat con ${otherUserName}`
      : 'Chat'

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}
      >
        <MessageSquare size={16} style={{ color: 'var(--gold)' }} />
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{headerLabel}</span>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textAlign: 'center',
              margin: 'auto',
            }}
          >
            Sin mensajes aún. ¡Sé el primero en escribir!
          </p>
        )}

        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId
          const senderName = (msg.sender as any)?.username || 'Desconocido'
          const timeStr = format(new Date(msg.created_at), 'HH:mm')

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start',
                gap: '0.2rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                {senderName}
              </span>
              <div
                style={{
                  maxWidth: '75%',
                  padding: '0.5rem 0.875rem',
                  borderRadius: isOwn ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  background: isOwn
                    ? 'rgba(245,158,11,0.2)'
                    : 'var(--bg-card)',
                  border: isOwn
                    ? '1px solid rgba(245,158,11,0.3)'
                    : '1px solid var(--border)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  color: 'var(--text-primary)',
                }}
              >
                {msg.content}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{timeStr}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}
      >
        <textarea
          className="form-input"
          rows={2}
          placeholder="Escribe un mensaje... (Enter para enviar)"
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= 1000) setInput(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            resize: 'none',
            fontSize: '0.875rem',
          }}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          title="Enviar"
          style={{ alignSelf: 'flex-end', flexShrink: 0 }}
        >
          <Send size={15} />
          {sending ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
