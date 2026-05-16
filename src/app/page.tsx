import { HomePage } from '@/ui/pages';
import { redirect } from 'next/navigation';

export default function Home() {
  return redirect('/booking');
}
