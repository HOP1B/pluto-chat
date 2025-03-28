import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type props_PFP = {
  displayName: string;
  size: number;
};

export const PFP = (props: props_PFP) => {
  return (
    <Avatar style={{ width: `${props.size}px`, height: `${props.size}px` }}>
      <AvatarImage
        width={props.size}
        height={props.size}
        src={`https://avatars.jakerunzer.com/${props.displayName}`}
        alt={`PFP_${props.displayName}`}
      />
      <AvatarFallback>{props.displayName.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
