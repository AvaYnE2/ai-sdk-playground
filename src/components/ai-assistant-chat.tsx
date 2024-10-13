"use client";

import { streamComponent } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface Message {
	id: number;
	component: any;
	sender: "user" | "ai";
}

export function AiAssistantChat() {
	const [messages, setMessages] = useState<Message[]>([
		{ id: 1, component: "Hello! How can I assist you today?", sender: "ai" },
	]);
	const [inputMessage, setInputMessage] = useState("");

	const handleSendMessage = async () => {
		if (inputMessage.trim() === "") return;

		const newMessage: Message = {
			id: messages.length + 1,
			component: inputMessage,
			sender: "user",
		};

		setMessages([...messages, newMessage]);
		setInputMessage("");

		const response = await streamComponent(inputMessage);

		const aiResponse: Message = {
			id: messages.length + 2,
			component: response,
			sender: "ai",
		};
		setMessages((prevState) => [...prevState, aiResponse]);
	};

	return (
		<div className="flex flex-col h-[800px] max-w-4xl mx-auto border rounded-lg overflow-hidden">
			<div className="bg-primary p-4">
				<h2 className="text-2xl font-bold text-primary-foreground">
					AI Assistant
				</h2>
			</div>
			<ScrollArea className="flex-grow p-4 space-y-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`max-w-[70%] rounded-lg p-3 ${
								message.sender === "user"
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-secondary-foreground"
							}`}
						>
							{message.component}
						</div>
					</div>
				))}
			</ScrollArea>
			<div className="p-4 border-t">
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await handleSendMessage();
					}}
					className="flex space-x-2"
				>
					<Input
						type="text"
						placeholder="Type your message..."
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						className="flex-grow"
					/>
					<Button type="submit" size="icon">
						<Send className="h-4 w-4" />
						<span className="sr-only">Send message</span>
					</Button>
				</form>
			</div>
		</div>
	);
}
