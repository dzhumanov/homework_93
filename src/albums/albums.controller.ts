import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/schemas/album.schema';

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
    }
    return this.albumModel.find().populate('artist', 'name');
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('artist', 'name');
    if (!album) {
      throw new NotFoundException('No such album!');
    }

    return album;
  }
}
