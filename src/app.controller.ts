import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { AppService, langData } from './app.service.js';
import * as fs from 'fs/promises';
import { Observable, interval, map } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { s } from './http.request.js';
import { log } from 'console';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
