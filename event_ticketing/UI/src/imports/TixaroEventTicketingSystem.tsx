import svgPaths from "./svg-932dmcxm6w";

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[36px] left-[-8px] rounded-[10px] top-0 w-[85.703px]" data-name="Button">
      <Icon />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[59px] text-[14px] text-center text-neutral-950 text-nowrap top-[6px] translate-x-[-50%] whitespace-pre">Back</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p283e7780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M15.1667 5.83333V8.16667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M15.1667 19.8333V22.1667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M15.1667 12.8333V15.1667" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-sky-500 box-border content-stretch flex items-center justify-center left-0 rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(14,165,233,0.5),0px_4px_6px_-4px_rgba(14,165,233,0.5)] size-[48px] top-0" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[36px] left-[56px] top-[6px] w-[75.531px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-[38.5px] text-[30px] text-center text-nowrap text-slate-50 top-[-3px] tracking-[-0.75px] translate-x-[-50%] whitespace-pre">Tixaro</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[48px] left-[158.23px] top-0 w-[131.531px]" data-name="Container">
      <Container />
      <Text />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-0 top-[64px] w-[448px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[224.66px] text-[16px] text-center text-nowrap text-slate-400 top-[-2px] translate-x-[-50%] whitespace-pre">Sign in to your account</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[88px] left-0 top-[52px] w-[448px]" data-name="Container">
      <Container1 />
      <Paragraph />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="[grid-area:1_/_1] h-[16px] justify-self-stretch relative shrink-0" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-0 text-[16px] text-nowrap text-slate-50 top-[-2px] whitespace-pre">Admin Login</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="[grid-area:2_/_1] place-self-stretch relative shrink-0" data-name="CardDescription">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-nowrap text-slate-400 top-[-2px] whitespace-pre">Enter your credentials to continue</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[74px] relative shrink-0 w-[446px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[20px_minmax(0px,_1fr)] h-[74px] pb-0 pt-[24px] px-[24px] relative w-[446px]">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-50 whitespace-pre">Email</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[rgba(30,30,46,0.3)] h-[36px] left-0 rounded-[10px] top-0 w-[398px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[398px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-400 whitespace-pre">Enter your email</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#1e1e2e] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2f8e7e80} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17070980} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input />
      <Icon2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Container3 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="h-[14px] relative shrink-0 w-[59.563px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[14px] items-center relative w-[59.563px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-50 whitespace-pre">Password</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[rgba(30,30,46,0.3)] h-[36px] left-0 rounded-[10px] top-0 w-[398px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[398px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-400 whitespace-pre">••••••••</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#1e1e2e] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Icon3 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-sky-500 h-[36px] relative rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(14,165,233,0.5),0px_4px_6px_-4px_rgba(14,165,233,0.5)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative w-full">
          <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-white">Sign In</p>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[190px] items-start left-[24px] top-0 w-[398px]" data-name="LoginPage">
      <Container4 />
      <Container7 />
      <Button2 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[446px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[446px]">
        <LoginPage />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[rgba(17,17,24,0.5)] box-border content-stretch flex flex-col gap-[24px] h-[402px] items-start left-0 p-px rounded-[16px] top-[172px] w-[448px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(30,30,46,0.5)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" />
      <CardHeader />
      <CardContent />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[574px] relative shrink-0 w-[448px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[574px] relative w-[448px]">
        <Button />
        <Container2 />
        <Card />
      </div>
    </div>
  );
}

export default function TixaroEventTicketingSystem() {
  return (
    <div className="content-stretch flex items-center justify-center relative size-full" data-name="Tixaro Event Ticketing System" style={{ backgroundImage: "linear-gradient(147.802deg, rgb(10, 10, 15) 0%, rgb(10, 10, 15) 50%, rgba(22, 36, 86, 0.2) 100%), linear-gradient(90deg, rgb(10, 10, 15) 0%, rgb(10, 10, 15) 100%)" }}>
      <Container8 />
    </div>
  );
}