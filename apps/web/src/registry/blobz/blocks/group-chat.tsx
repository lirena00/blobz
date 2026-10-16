import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	type AvatarSource,
} from "@/components/ui/avatar";
export interface GroupChatPerson {
	readonly avatar: AvatarSource;
	readonly id: string;
	readonly name: string;
}

export interface GroupChatMessage {
	readonly author: GroupChatPerson;
	readonly id: string;
	readonly text: string;
	readonly time: string;
}

export interface GroupChatProps
	extends Omit<ComponentProps<"section">, "children"> {
	readonly channel: string;
	readonly messages: readonly GroupChatMessage[];
	readonly participants?: readonly GroupChatPerson[];
	readonly typing?: GroupChatPerson;
}

export function GroupChat({
	channel,
	className,
	messages,
	participants = [],
	typing,
	...props
}: GroupChatProps) {
	const visibleParticipants = participants.slice(0, 4);
	const remainingCount = participants.length - visibleParticipants.length;

	return (
		<section
			aria-label={`${channel} group chat`}
			className={cn(
				"w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs",
				className
			)}
			data-slot="group-chat"
			{...props}
		>
			<header className="flex min-h-16 items-center justify-between gap-4 border-border border-b px-5 py-3">
				<span className="min-w-0 truncate font-semibold text-foreground text-sm">
					<span aria-hidden="true" className="me-2 text-muted-foreground">
						#
					</span>
					{channel}
				</span>
				{participants.length > 0 && (
					<AvatarGroup aria-label={`${participants.length} participants`}>
						{visibleParticipants.map((person) => (
							<Avatar frame="circle" key={person.id} size="sm">
								<AvatarImage alt="" src={person.avatar.src} />
								<AvatarFallback
									alt=""
									choices={person.avatar.choices}
									name={person.avatar.name}
									palette={person.avatar.palette}
								/>
							</Avatar>
						))}
						{remainingCount > 0 && (
							<AvatarGroupCount
								count={remainingCount}
								frame="circle"
								size="sm"
							/>
						)}
					</AvatarGroup>
				)}
			</header>
			<ol className="flex flex-col gap-5 px-5 py-6">
				{messages.map((message) => (
					<li className="flex items-start gap-3" key={message.id}>
						<Avatar frame="circle" size="sm">
							<AvatarImage alt="" src={message.author.avatar.src} />
							<AvatarFallback
								alt=""
								choices={message.author.avatar.choices}
								name={message.author.avatar.name}
								palette={message.author.avatar.palette}
							/>
						</Avatar>
						<div className="min-w-0 flex-1">
							<div className="flex items-baseline gap-2">
								<span className="truncate font-semibold text-foreground text-sm">
									{message.author.name}
								</span>
								<time className="shrink-0 text-muted-foreground text-xs">
									{message.time}
								</time>
							</div>
							<p className="mt-0.5 whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed [overflow-wrap:anywhere]">
								{message.text}
							</p>
						</div>
					</li>
				))}
				{typing ? (
					<li className="flex items-center gap-3 text-muted-foreground text-xs">
						<Avatar frame="circle" size="sm">
							<AvatarImage alt="" src={typing.avatar.src} />
							<AvatarFallback
								alt=""
								choices={typing.avatar.choices}
								name={typing.avatar.name}
								palette={typing.avatar.palette}
							/>
						</Avatar>
						<span role="status">
							{typing.name} is typing<span aria-hidden="true">…</span>
						</span>
					</li>
				) : null}
			</ol>
		</section>
	);
}
