import { Module } from "@nestjs/common";
import { TelegramMusic } from "./bot.update";

@Module({
    providers: [TelegramMusic]
})
export class BotModule {}