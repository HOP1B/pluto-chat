import Image from "next/image";

type props_PFP = {
  displayName: string;
  size: number;
};

export const PFP = (props: props_PFP) => {
  return (
    <Image
      src={`https://avatars.jakerunzer.com/${props.displayName}`}
      alt={`PFP_${props.displayName}`}
      width={props.size}
      height={props.size}
      style={{ width: `${props.size}px`, height: `${props.size}px` }}
      className="rounded-full"
    ></Image>
  );
};
