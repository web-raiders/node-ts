import { Request, Response } from 'express';
import sendgrid from '@sendgrid/mail';
import env from '../config/env';
import { Tools } from './tools';

const { ADMIN_EMAIL, SENDGRID_SECRET } = env;
const { createVerificationLink, createPasswordResetLink } = Tools;

sendgrid.setApiKey(SENDGRID_SECRET as string);

/**
 * Sendgrid Mailing Service
 */
const Mailer = {
  /**
   * send email verification to user after signup
   * @param {object} req
   * @param {object} user - { id, email, firstName ...etc}
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendVerificationEmail(
    req: Request,
    user: { id: number; email: string; firstName: string; type: string }
  ): Promise<boolean> {
    const { id, email, firstName, type } = user;
    const verificationLink = createVerificationLink(req, { id, email, firstName, type });
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      templateId: '',
      dynamic_template_data: {
        name: firstName,
        verificationLink,
      },
    };
    try {
      await sendgrid.send(mail as any);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * send email for password reset
   * @param {object} req
   * @param {object} user
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendPasswordResetEmail(
    req: Request,
    user: { id: number; email: string; firstName: string; type: string }
  ): Promise<boolean> {
    const { id, email, firstName, type } = user;
    const passwordResetLink = createPasswordResetLink(req, {
      id,
      email,
      firstName,
      type,
    });
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      templateId: '',
      dynamic_template_data: {
        name: firstName,
        reset_link: passwordResetLink,
      },
    };
    try {
      await sendgrid.send(mail as any);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default Mailer;
