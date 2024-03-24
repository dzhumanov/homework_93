import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from './artist.schema';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: Artist.name, required: true })
  artist: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  date: number;

  @Prop()
  image: string;

  @Prop({ default: false })
  isPublished: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
export type AlbumDocument = Album & Document;
