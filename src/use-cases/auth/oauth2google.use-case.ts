import { Inject } from '@nestjs/common';
import { Role } from '@prisma/client';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import * as jwt from 'jsonwebtoken';

export class OAuth2Google {
  constructor(
    @Inject('GOOGLE_OAUTH')
    private readonly oauth2Client: OAuth2Client,
    private readonly userRepository: UserRepository,
  ) {}

  getAuth(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });
  }

  async getUserCredential(userUrlInfo: string, accessToken: string) {
    try {
      const { data } = await axios.get(userUrlInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  async saveOAuthToJwtAndRedirect(code: string): Promise<string | null> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    console.log('google token: ', tokens);

    const userUrlInfo = 'https://www.googleapis.com/oauth2/v1/userinfo';

    try {
      const userInfo = await this.getUserCredential(userUrlInfo, tokens.access_token || "");

      let user = await this.userRepository.findByEmailWithoutError(
        userInfo?.email,
      );

      if (!user) {
        user = await this.userRepository.create({
          email: userInfo?.email,
          // password: "",
          role: Role.CUSTOMER,
        });
      }

      return jwt.sign(
        {
          userId: user?.id,
          email: user?.email,
          role: user?.role,
        },
        process.env.SECRET_KEY || 'secret',
        {
          expiresIn: '1h',
        },
      );
    } catch (err) {
      // console.log(err?.message);
    }

    return null;
  }
}
