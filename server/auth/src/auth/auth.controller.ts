import { Controller, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthVK } from 'src/vk/vk.model';
import { VkService } from 'src/vk/vk.service';
import { ExceptionFilter } from '../rpc-exception.filter';
import { GoogleService } from 'src/google/google.service';

@UseFilters(ExceptionFilter)
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private tokenService: TokensService,
        private vkService: VkService,
        private googleService: GoogleService
        // private readonly sharedService: SharedService,
    ) {}

    @MessagePattern({ cmd: 'vk' })
    async vkAuth(
        // @Ctx() context: RmqContext,
        @Payload() auth: AuthVK,
    ) {
        // this.sharedService.acknowledgeMessage(context);
        // console.log(`[auth][users.controller][getUserByEmail] email: ${JSON.stringify(email)}`);

        return await this.vkService.loginVk(auth); 
    }

    @MessagePattern({ cmd: 'google-callback' })
    async googleAuthRedirect(
        // @Ctx() context: RmqContext,
        @Payload() user 
    ) {
        // this.sharedService.acknowledgeMessage(context);
        // console.log(`[auth][users.controller][getUserByEmail] email: ${JSON.stringify(email)}`);

        return await this.googleService.googleLogin(user);
    }

    @MessagePattern({ cmd: 'login' })
    async login(
        // @Ctx() context: RmqContext,
        @Payload() dto: LoginDto, 
        // @Payload('response') response // Женя: закомментил респонс и убрал его из всей цепочки
    ){
        // this.sharedService.acknowledgeMessage(context);
        // console.log(`[auth][users.controller][getUserByEmail] email: ${JSON.stringify(email)}`);

        return await this.authService.login(dto); 
    }

    @MessagePattern({ cmd: 'registration' })
    async registration(
        // @Ctx() context: RmqContext,
        // @Payload('dto') dto: LoginDto,
        // @Payload('response') response
        @Payload() obj: LoginDto
    ) {
        return await this.authService.registration(obj)
        // this.sharedService.acknowledgeMessage(context);
        // console.log(`[auth][users.controller][getUserByEmail] email: ${JSON.stringify(email)}`);

        // return await this.authService.registration(dto, response);
    }

    @MessagePattern({ cmd: 'logout' })
    async logout(
        // @Ctx() context: RmqContext,
        @Payload() refreshToken,
    ) {
        // this.sharedService.acknowledgeMessage(context);
        // console.log(`[auth][users.controller][createUser] +`);

        return await this.authService.logout(refreshToken);
    }

    @MessagePattern({ cmd: 'refresh' })
    async refresh(
        @Payload() refreshToken,
    ) {
        return await this.tokenService.refresh(refreshToken);
    }
}
