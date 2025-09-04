type User = {
    id: number;
    name: string;
    email: string;
  };
  
  type ProfileInfoProps = {
    user: User;
  };
  
  export default function ProfileInfo({ user }: ProfileInfoProps) {
    return (
      <div className="border p-4 rounded mb-6 bg-white">
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-700">{user.email}</p>
      </div>
    );
  }
  