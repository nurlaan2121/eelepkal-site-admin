import {DashboardCard} from "@/shared/ui";
import {ArrowUpRight, Clock, Users} from "lucide-react";

export const UpcomingBookings = () => {
  return (
    <DashboardCard
      className="lg:col-span-2"
      title="Ближайшие брони"
      action="Весь график"
    >
      <div className="divide-y divide-gray-50">
        {[
          {id: 1, time: "18:30", name: "Айбек Ж.", guests: 4, table: "Стол 5"},
          {id: 2, time: "19:00", name: "Елена К.", guests: 2, table: "Стол 2"},
          {
            id: 3,
            time: "19:30",
            name: "Марат С.",
            guests: 6,
            table: "Кабинка 1",
          },
          {id: 4, time: "20:00", name: "Данияр Т.", guests: 3, table: "Стол 8"},
          {
            id: 5,
            time: "20:30",
            name: "Нурбек М.",
            guests: 5,
            table: "Стол 12",
          },
        ].map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </DashboardCard>
  );
};

const BookingCard = ({
  booking,
}: {
  booking: {
    id: number;
    time: string;
    name: string;
    guests: number;
    table: string;
  };
}) => {
  return (
    <div className="p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex flex-col items-center justify-center shadow-sm">
          <Clock size={12} className="text-brand-500 mb-0.5" />
          <span className="text-sm font-black text-gray-900">
            {booking.time}
          </span>
        </div>
        <div>
          <p className="text-sm font-black text-gray-900">{booking.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <Users size={10} /> {booking.guests} чел.
            </span>
            <span className="text-[10px] font-bold text-brand-600 uppercase bg-brand-50 px-1.5 py-0.5 rounded-md">
              {booking.table}
            </span>
          </div>
        </div>
      </div>
      <ArrowUpRight className="text-brand-500" size={20} />
    </div>
  );
};
