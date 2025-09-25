import FanProfile from '../FanProfile';
import { mockUser, mockCredentials } from '@/lib/mockData';

export default function FanProfileExample() {
  return <FanProfile user={mockUser} credentials={mockCredentials} />;
}