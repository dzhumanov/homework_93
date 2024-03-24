import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './album.schema';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Track {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: Album.name, required: true })
  album: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  trackNumber: number;

  @Prop()
  link: string;

  @Prop()
  image: string;

  @Prop({ default: false })
  isPublished: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
export type TrackDocument = Track & Document;
