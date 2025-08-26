
import { Provider } from 'jotai';
import { BarChart3 } from 'lucide-react';
import { PriceTicker } from '@/widgets/price-ticker';
import { OrderForm } from '@/widgets/order-form';
import { PositionPanel } from '@/widgets/position-panel';

function TradingPageContent() {
  return (
    <div className="min-h-screen min-w-[320px] bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10">
        <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Mini-Perp Trading Widget
                </h1>
                <p className="text-gray-400">
                  Bitcoin perpetual futures trading interface
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PriceTicker />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <OrderForm />
            </div>

            <div className="lg:col-span-2">
              <PositionPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function TradingPage() {
  return (
    <Provider>
      <TradingPageContent />
    </Provider>
  );
}
