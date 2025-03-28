import React from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { Card } from '../ui/Card';
import { formatDate } from '../../utils/date';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  return (
    <Card className="relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatDate(event.dueDate)}</span>
            {event.startTime && (
              <span className="ml-2">
                {event.startTime} - {event.endTime}
              </span>
            )}
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium
              ${event.type === 'task' && 'bg-blue-100 text-blue-800'}
              ${event.type === 'deadline' && 'bg-red-100 text-red-800'}
              ${event.type === 'meeting' && 'bg-purple-100 text-purple-800'}
              ${event.type === 'test' && 'bg-green-100 text-green-800'}
            `}
          >
            {event.type}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium
              ${event.priority === 'high' && 'bg-red-100 text-red-800'}
              ${event.priority === 'medium' && 'bg-yellow-100 text-yellow-800'}
              ${event.priority === 'low' && 'bg-green-100 text-green-800'}
            `}
          >
            {event.priority} priority
          </span>
        </div>
      </div>
    </Card>
  );
}