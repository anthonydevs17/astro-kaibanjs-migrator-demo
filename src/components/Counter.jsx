import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        Contador React
      </h2>
      <div className='flex items-center justify-center space-x-4 mb-4'>
        <button
          onClick={() => setCount(count - 1)}
          className='p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200'
          aria-label='Decrementar'
        >
          <Minus size={20} />
        </button>
        <span className='text-3xl font-bold text-gray-700'>{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className='p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200'
          aria-label='Incrementar'
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
