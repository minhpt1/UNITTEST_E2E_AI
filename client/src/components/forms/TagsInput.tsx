import React from 'react';

interface TagsInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className="form-group">
      <label>Tags</label>
      <div className="tags-input">
        <div className="tag-input-wrapper">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter tag and press Enter"
          />
          <button type="button" onClick={onAddTag} className="add-tag-btn">
            Add
          </button>
        </div>
        <div className="tags-list">
          {tags.map(tag => (
            <span key={tag} className="tag-item">
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="remove-tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsInput;