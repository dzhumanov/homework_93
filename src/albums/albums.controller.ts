import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/schemas/album.schema';
import { CreateAlbumDto } from './create-album.dto';
import { TokenAuthGuard } from 'src/auth/token-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { TokenPermitGuard } from 'src/auth/token-permit.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  getAll(@Query('artistId') artistId: string) {
    if (artistId) {
      return this.albumModel
        .find({ artist: artistId })
        .populate('artist', 'name');
    } else {
      return this.albumModel.find().populate('artist', 'name');
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('artist', 'name');
    if (!album) {
      throw new NotFoundException('No such album!');
    }

    return album;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      name: albumData.name,
      artist: albumData.artist,
      date: albumData.date,
      isPublished: albumData.isPublished,
      image: file ? '/uploads/artists' + file.filename : null,
    });
    return album.save();
  }

  @Roles('admin')
  @UseGuards(TokenAuthGuard, TokenPermitGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new NotFoundException('No such album!');
    }

    return album;
  }
}
