import { Button } from "../ui/button";

const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  return (
    <div className="post-card ">
      <div className="flex items-center justify-between text-gray-500 font-medium">
        <span>Sponsored Ads</span>
        <img src="/more.png" alt="" width={16} height={16} />
      </div>
      <div
        className={`flex flex-col mt-4 ${size === "sm" ? "gap-2" : "gap-4"}`}
      >
        <div
          className={`relative w-full ${
            size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"
          }`}
        >
          <img
            src="https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            alt=""
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-4">
          <img
            src="https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            alt=""
            width={24}
            height={24}
            className="rounded-full w-6 h-6 object-cover"
          />
          <span className="text-blue-500 font-medium">BigChef Lounge</span>
        </div>
        <p className={size === "sm" ? "text-xs" : "text-sm"}>
          {size === "sm"
            ? "Experience the best dining with exquisite flavors and unique dishes."
            : size === "md"
            ? "Experience the best dining with exquisite flavors and unique dishes. Join us for an unforgettable culinary adventure."
            : "Experience the best dining with exquisite flavors and unique dishes. Join us for an unforgettable culinary adventure. Book your table today and savor the extraordinary."}
        </p>
        <Button className="shad-button_primary p-2 text-xs">
          Learn more
        </Button>
      </div>
    </div>
  );
};

export default Ad;
