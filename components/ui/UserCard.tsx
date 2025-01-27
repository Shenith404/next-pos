
import Image from "next/image";

interface UserCardProps {
  type: string;
  count: number;
}

const UserCard = ({ type, count }: UserCardProps) => {
  console.log("UserCard rendered", count);
  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px] bg-primary/55">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          All
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-md font-medium text-gray-200">{type}s</h2>
    </div>
  );
};

export default UserCard;
