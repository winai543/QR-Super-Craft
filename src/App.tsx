/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import QRGenerator from './components/QRGenerator';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <QRGenerator />
      </div>
    </TooltipProvider>
  );
}
