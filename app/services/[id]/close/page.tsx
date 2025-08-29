import CloseTicketForm from '@/CloseTicketForm'

interface Params { params: { id: string } }

export default function Page({ params }: Params) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Close Ticket</h1>
      <CloseTicketForm ticketId={params.id} />
    </div>
  )
}

