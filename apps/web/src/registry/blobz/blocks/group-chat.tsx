import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";
import {
	BlobAvatarGroup,
	BlobAvatarGroupCount,
	BlobAvatarGroupItem,
} from "@/registry/blobz/components/avatar-group";

export interface GroupChatPerson {
	readonly avatar: Omit<BlobAvatarProps, "alt" | "size">;
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
				"w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
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
					<BlobAvatarGroup aria-label={`${participants.length} participants`}>
						{visibleParticipants.map((person) => (
							<BlobAvatarGroupItem frame="circle" key={person.id}>
								<BlobAvatar
									{...person.avatar}
									alt=""
									frame="circle"
									size="sm"
								/>
							</BlobAvatarGroupItem>
						))}
						{remainingCount > 0 && (
							<BlobAvatarGroupCount
								count={remainingCount}
								frame="circle"
								size="sm"
							/>
						)}
					</BlobAvatarGroup>
				)}
			</header>
			<ol className="space-y-5 px-5 py-6">
				{messages.map((message) => (
					<li className="flex items-start gap-3" key={message.id}>
						<BlobAvatar
							{...message.author.avatar}
							alt=""
							frame="circle"
							size="sm"
						/>
						<div className="min-w-0 flex-1">
							<div className="flex items-baseline gap-2">
								<span className="truncate font-semibold text-foreground text-sm">
									{message.author.name}
								</span>
								<time className="shrink-0 text-muted-foreground text-xs">
									{message.time}
								</time>
							</div>
							<p className="mt-0.5 whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
								{message.text}
							</p>
						</div>
					</li>
				))}
				{typing ? (
					<li className="flex items-center gap-3 text-muted-foreground text-xs">
						<BlobAvatar {...typing.avatar} alt="" frame="circle" size="sm" />
						<span role="status">
							{typing.name} is typing<span aria-hidden="true">…</span>
						</span>
					</li>
				) : null}
			</ol>
		</section>
	);
}
