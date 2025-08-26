import { TradingPage } from '@/pages/trading';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import './styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <TradingPage />
    </ErrorBoundary>
  );
}

export default App;
