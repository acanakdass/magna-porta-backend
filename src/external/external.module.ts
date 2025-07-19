import {Module} from '@nestjs/common';
import {ExternalService} from "./external.service";
import {AwConnectedAccountsService} from "./air-wallex/services/aw-connected-accounts.service";
import {AwAccountService} from "./air-wallex/services/aw-account.service";
import {AwAuthService} from "./air-wallex/services/aw-auth.service";
import {AwConnectedAccountsController} from "./air-wallex/controllers/aw-connected-accounts.controller";

@Module({
    providers: [ExternalService,
        AwConnectedAccountsService,
        AwAccountService,
        AwAuthService],
    exports: [
        ExternalService,
        AwConnectedAccountsService,
        AwAccountService,
        AwAuthService
    ],
    controllers:[AwConnectedAccountsController]
})
export class ExternalModule {}