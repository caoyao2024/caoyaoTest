// Layer 3 — 附件上传区（H5 自绘，替代 antd Upload）

import { useRef, useState } from "react";
import { IconPlusIcPublicCheckmark, IconPlusIcPublicClose, IconPlusIcPublicFiles, IconPlusIcPublicUpload } from "@nce/icon-plus";
import "./index.css";

const SEED_FILES = [
  { uid: "f1", name: "A机房核心交换机告警截图.png", size: "1.4 MB", status: "done" },
  { uid: "f2", name: "switch-core-01-log-0928.txt", size: "328 KB", status: "done" },
];

export default function UploadDropzone({ maxSize = 20 }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState(SEED_FILES);
  const [dragging, setDragging] = useState(false);

  function pick() {
    if (inputRef.current) inputRef.current.click();
  }

  function addFiles(fileList) {
    const added = Array.prototype.slice.call(fileList).map(function (f, i) {
      return {
        uid: "f" + Date.now() + "-" + i,
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(1) + " MB",
        status: "done",
      };
    });
    if (added.length) setFiles(function (prev) { return prev.concat(added); });
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function remove(uid) {
    setFiles(function (prev) { return prev.filter(function (f) { return f.uid !== uid; }); });
  }

  return (
    <div className="upload">
      <div
        className={"upload__zone" + (dragging ? " upload__zone--active" : "")}
        onClick={pick}
        onDragOver={function (e) { e.preventDefault(); setDragging(true); }}
        onDragLeave={function () { setDragging(false); }}
        onDrop={onDrop}
      >
        <span className="upload__icon">
          <IconPlusIcPublicUpload iconSize="1.5rem" iconColor={['currentcolor']} />
        </span>
        <p className="upload__title">点击或拖拽文件到此处上传</p>
        <p className="upload__desc">
          支持 PNG / JPG / PDF / LOG / TXT，单个文件不超过 {maxSize}MB，最多 10 个
        </p>
        <input
          ref={inputRef}
          className="upload__input"
          type="file"
          multiple
          onChange={function (e) { addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {files.length ? (
        <ul className="upload__list">
          {files.map(function (f) {
            return (
              <li className="upload__item" key={f.uid}>
                <IconPlusIcPublicFiles iconSize="1rem" iconColor={["currentcolor"]} className="upload__file-icon" />
                <span className="upload__name">{f.name}</span>
                <span className="upload__size">{f.size}</span>
                <IconPlusIcPublicCheckmark iconSize="1rem" iconColor={['currentcolor']} className="upload__ok" />
                <button
                  type="button"
                  className="upload__remove"
                  onClick={function () { remove(f.uid); }}
                  aria-label="移除附件"
                >
                  <IconPlusIcPublicClose iconSize="0.875rem" iconColor={['currentcolor']} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
