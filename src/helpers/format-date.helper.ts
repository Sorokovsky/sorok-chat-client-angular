import {format} from 'date-fns';
import {uk} from 'date-fns/locale';

export function formatDate(date: Date): string {
  return format(date, 'yyy.MM.dd HH:mm', {locale: uk});
}
