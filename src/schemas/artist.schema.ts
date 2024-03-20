import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Artist {
  @Prop({ required: true })
  name: string;

  @Prop()
  info: string;

  @Prop()
  photo: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
export type ArtistDocument = Artist & Document;
