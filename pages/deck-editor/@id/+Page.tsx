import { usePageContext } from 'vike-react/usePageContext';
import DeckEditor from '../../../components/deck-editor/DeckEditor';

export default Page;

function Page() {
  const pageContext = usePageContext();
  const deckId = pageContext.routeParams?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <DeckEditor deckId={deckId} />
    </div>
  );
}