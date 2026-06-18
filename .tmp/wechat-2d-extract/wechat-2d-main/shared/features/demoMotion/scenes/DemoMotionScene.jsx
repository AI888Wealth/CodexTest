import { useEffect } from "react";
import lobsterAvatarUrl from "../assets/lobster-avatar.svg";
import mxzAvatarUrl from "../assets/mxz-avatar.jpg";
import cover1x1Url from "../reference/1x1.png";
import cover3x4Url from "../reference/3x4.png";
import cover4x3Url from "../reference/4x3.png";
import cover9x16Url from "../reference/9x16.png";
import cover16x9Url from "../reference/16x9.png";
import {
  CHAT_PARTNER_NAME,
  COMPOSER_HEIGHT,
  HEADER_HEIGHT,
  POP_MOTION_SECONDS,
  ROLE_CHAT_PARTNER,
  ROLE_SELF,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STREAM_REVEAL_SECONDS,
  STREAM_SPEED_MULTIPLIER,
  easeOutBack,
  getFrameProgress,
  getMediaWidthRatio,
  isSelfMessage,
  usesStreamingTextMotion,
} from "./chatMotionData.js";

const DEFAULT_VOICE_WAVE_STROKE_WIDTH = 0.55;
const DEFAULT_VOICE_WAVE_SPACING = 1.03;

const CHAT_PARTICIPANTS = {
  [ROLE_SELF]: {
    name: "猫学长",
    avatar: mxzAvatarUrl,
    avatarClass: "shadow-sm object-cover",
  },
  [ROLE_CHAT_PARTNER]: {
    name: "龙虾",
    avatar: lobsterAvatarUrl,
    avatarClass: "bg-white shadow-sm",
  },
};

const VIDEO_COVERS_BY_ASPECT = {
  [String(9 / 16)]: cover9x16Url,
  [String(3 / 4)]: cover3x4Url,
  [String(1)]: cover1x1Url,
  [String(4 / 3)]: cover4x3Url,
  [String(16 / 9)]: cover16x9Url,
};

const getVideoCoverUrl = (aspectRatio) =>
  VIDEO_COVERS_BY_ASPECT[String(aspectRatio)] ?? cover1x1Url;

const IconChevronLeft = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconMore = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
);

const IconMicrophone = () => {
  const offset1 = (94 - 110.85) * DEFAULT_VOICE_WAVE_SPACING + 110.85;
  const offset2 = 118.4;
  const offset3 = (135.4 - 110.85) * DEFAULT_VOICE_WAVE_SPACING + 110.85;

  return (
    <svg
      className="h-7 w-7 text-[#2f2f2f]"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m86.31 121.6 15.67-15.4c4.84 3.96 5.45 10.65 5.45 15.4 0 6.28-2.72 11.13-5.45 14.5l-15.67-14.5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={DEFAULT_VOICE_WAVE_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${offset1 - 94}, 0) scale(0.096)`}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="m118.4 89.46-7.13 7.6c7.63 8.02 10.51 16.19 10.51 24.68 0 10.03-4.84 19.14-10.51 25.17l7.5 7.34c9.95-10.28 13.1-21.51 13.1-32.51 0-12.89-5.92-25.13-13.47-32.28z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={DEFAULT_VOICE_WAVE_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${offset2 - 118.4}, 0) scale(0.096)`}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="m135.4 71.21-7.54 7.9c11.83 12.62 18.09 25.51 18.09 42.5 0 15.55-7.01 31.37-17.89 43.71l7.54 6.4c13.49-13.96 20.9-30.11 20.9-50.11 0-18.7-7.62-36.59-21.1-50.4z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={DEFAULT_VOICE_WAVE_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${offset3 - 135.4}, 0) scale(0.096)`}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const IconEmoji = () => (
  <svg className="h-7 w-7 text-[#2f2f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" d="M8.5 8.5v.01M15.5 8.5v.01" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M7 12.5h10a5 5 0 0 1-10 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="h-7 w-7 text-[#2f2f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
    <path strokeLinecap="round" strokeWidth="1.7" d="M12 8v8M8 12h8" />
  </svg>
);

const IconPlay = () => (
  <svg
    className="h-5 w-5 translate-x-[0.5px] text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }}
  >
    <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
  </svg>
);

const ChatHeader = () => (
  <div className="relative flex items-center justify-between border-b border-gray-300 bg-[#ededed] px-4 py-3">
    <IconChevronLeft />
    <span className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
      {CHAT_PARTNER_NAME}
    </span>
    <IconMore />
  </div>
);

const ChatComposer = () => (
  <div
    className="flex shrink-0 items-start gap-2 bg-[#f7f7f7] px-3 pb-4 pt-2.5"
    style={{ height: COMPOSER_HEIGHT }}
  >
    <div className="mt-[5px] shrink-0">
      <IconMicrophone />
    </div>
    <div className="mt-[-1px] h-10 flex-1 rounded-md bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]" />
    <div className="mt-[5px] shrink-0">
      <IconEmoji />
    </div>
    <div className="mt-[5px] shrink-0">
      <IconPlus />
    </div>
  </div>
);

const TimeStamp = ({ label }) => (
  <div className="text-center">
    <span className="rounded px-2 py-[3px] text-[13px] leading-[18px] text-[#9b9b9b]">
      {label}
    </span>
  </div>
);

const Avatar = ({ profile }) => (
  <img
    src={profile.avatar}
    alt={profile.name}
    className={`h-10 w-10 shrink-0 rounded ${profile.avatarClass}`}
  />
);

const TextBubble = ({ text, isSelf = false, children = null }) => {
  const bubbleClass = isSelf ? "bg-[#95ec69]" : "bg-white";
  const tailClass = isSelf ? "right-[-4px] bg-[#95ec69]" : "left-[-4px] bg-white";
  const paddingClass = isSelf ? "px-[10px]" : "pl-[10px] pr-[9px]";

  return (
    <div
      className={`relative max-w-[250px] rounded-lg ${paddingClass} py-2 text-[14.5px] leading-6 text-gray-800 shadow-sm ${bubbleClass}`}
    >
      {children || text}
      <span className={`absolute top-3 h-2 w-2 rotate-45 ${tailClass}`} />
    </div>
  );
};

const MessageRow = ({ item, children }) => {
  const profile = CHAT_PARTICIPANTS[item.from];
  const isSelf = isSelfMessage(item);
  const directionClass = isSelf ? "flex-row-reverse" : "";
  const alignClass = isSelf ? "items-end" : "";

  return (
    <div className={`flex max-w-full gap-3 ${directionClass}`}>
      <Avatar profile={profile} />
      <div className={`flex flex-col gap-1 ${alignClass}`}>{children}</div>
    </div>
  );
};

const WeChatVideoMessage = ({ aspectRatio, duration }) => {
  const cardWidth = Math.round(SCREEN_WIDTH * getMediaWidthRatio(aspectRatio));

  return (
    <div
      className="relative select-none overflow-hidden rounded"
      style={{
        width: cardWidth,
        aspectRatio,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      <img
        src={getVideoCoverUrl(aspectRatio)}
        alt=""
        className="h-full w-full bg-black object-contain"
        draggable={false}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-transparent"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
        >
          <IconPlay />
        </div>
      </div>
      <div
        className="absolute bottom-1.5 right-2 text-xs font-medium tracking-wide text-white"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
      >
        {duration}
      </div>
    </div>
  );
};

const getPopStyle = (item, slot, currentFrame, fps) => {
  const progress = getFrameProgress(currentFrame, slot.startFrame, POP_MOTION_SECONDS * fps);
  const eased = easeOutBack(progress);
  const baseScale = 0.86;
  const scale = baseScale + (1 - baseScale) * eased;
  const isSelf = isSelfMessage(item);

  return {
    opacity: progress,
    transform: `scale(${scale})`,
    transformOrigin: isSelf ? "right center" : "left center",
  };
};

const ChatItem = ({ item, slot, currentFrame, fps }) => {
  if (item.type === "timestamp") {
    return <TimeStamp label={item.label} />;
  }

  if (!slot) {
    return null;
  }

  if (usesStreamingTextMotion(item)) {
    const progress = getFrameProgress(currentFrame, slot.startFrame, slot.motionFrames);
    const textChars = Array.from(item.text || "");
    const visibleCount = Math.floor(progress * textChars.length);
    const visibleText = textChars.slice(0, visibleCount).join("");
    const revealProgress = getFrameProgress(
      currentFrame,
      slot.startFrame,
      (STREAM_REVEAL_SECONDS / STREAM_SPEED_MULTIPLIER) * fps
    );

    return (
      <div
        style={{
          opacity: revealProgress,
          transform: `translateY(${(1 - revealProgress) * 8}px)`,
        }}
      >
        <MessageRow item={item}>
          <TextBubble isSelf={isSelfMessage(item)}>
            <span>{visibleText}</span>
          </TextBubble>
        </MessageRow>
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <div style={getPopStyle(item, slot, currentFrame, fps)}>
        <MessageRow item={item}>
          <WeChatVideoMessage aspectRatio={item.aspectRatio} duration={item.duration} />
        </MessageRow>
      </div>
    );
  }

  if (item.type === "text") {
    return (
      <div style={getPopStyle(item, slot, currentFrame, fps)}>
        <MessageRow item={item}>
          <TextBubble text={item.text} isSelf={isSelfMessage(item)} />
        </MessageRow>
      </div>
    );
  }

  return null;
};

export const DemoMotionScene = ({
  currentFrame,
  fps,
  visibleEntries,
  slotsByIndex,
  scrollOffset,
  layout,
  onAutoLayoutReady,
}) => {
  useEffect(() => {
    onAutoLayoutReady?.();
  }, [onAutoLayoutReady]);

  const videoWidth = layout?.videoWidth ?? SCREEN_WIDTH;
  const videoHeight = layout?.videoHeight ?? SCREEN_HEIGHT;
  const scale = Math.min(videoWidth / SCREEN_WIDTH, videoHeight / SCREEN_HEIGHT);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: "#d8d8d8",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div
        className="absolute overflow-hidden border-x border-gray-200 bg-[#ededed] text-gray-800 shadow-sm"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute left-0 right-0 z-0 overflow-hidden"
          style={{
            top: HEADER_HEIGHT,
            bottom: COMPOSER_HEIGHT,
          }}
        >
          <div
            className="space-y-6 px-4 py-4"
            style={{
              transform: `translateY(${-scrollOffset}px)`,
            }}
          >
            {visibleEntries.map((entry) => (
              <ChatItem
                key={`${entry.item.type}-${entry.originalIndex}`}
                item={entry.item}
                slot={slotsByIndex[entry.originalIndex]}
                currentFrame={currentFrame}
                fps={fps}
              />
            ))}
          </div>
        </div>

        <div className="absolute left-0 right-0 top-0 z-20">
          <ChatHeader />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ChatComposer />
        </div>
      </div>
    </div>
  );
};
